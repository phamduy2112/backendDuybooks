CREATE TABLE users (
      id SERIAL PRIMARY KEY,
    full_name VARCHAR(50) NULL,  -- Cho phép NULL
    email VARCHAR(100) NULL UNIQUE,  -- Cho phép NULL
    password VARCHAR(255) NULL,  -- Cho phép NULL
    phone_number VARCHAR(10) NULL,  -- Cho phép NULL
    avatar_url TEXT NULL,  -- Cho phép NULL
    nick_name VARCHAR(100) NULL,  -- Cho phép NULL
        birth_date DATE Null,
        marriage_condition Text null,
    role VARCHAR(50) DEFAULT 'customer', -- Vai trò (customer, admin, v.v.)
    status VARCHAR(20) DEFAULT 'active', -- Trạng thái tài khoản (active, inactive, banned)
    bio TEXT NULL,  -- Cho phép NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE code (
  id SERIAL PRIMARY KEY,            -- ID tự tăng, sử dụng SERIAL cho PostgreSQL
  user_id INTEGER NOT NULL,         -- user_id, kiểu INTEGER (hoặc UUID nếu bạn muốn dùng UUID)
  code VARCHAR(255) NOT NULL,       -- Mã OTP, kiểu VARCHAR với độ dài tối đa 255 ký tự
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo mã OTP, mặc định là thời gian hiện tại
  FOREIGN KEY (user_id) REFERENCES users(id)  -- Khóa ngoại liên kết với bảng users, thay đổi nếu tên bảng hoặc khóa khác
);

CREATE TABLE friends (
    id SERIAL PRIMARY KEY,  -- ID tự động tăng
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Người dùng thực hiện hành động kết bạn
    friend_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Bạn bè của người dùng
    status VARCHAR(20) DEFAULT 'pending',  -- Trạng thái của mối quan hệ: pending, accepted, rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo yêu cầu
    CONSTRAINT unique_friendship UNIQUE (user_id, friend_id),  -- Đảm bảo mối quan hệ không bị trùng lặp
    CONSTRAINT check_user_friend CHECK (user_id <> friend_id), -- Đảm bảo không thể kết bạn với chính mình
    CONSTRAINT no_duplicate_friendship CHECK (
        (user_id < friend_id) -- Tránh việc có bản ghi đảo ngược user_id và friend_id
    )
);
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,  -- ID tự động tăng
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Người nhận thông báo
    message TEXT,  -- Nội dung thông báo
    type VARCHAR(50),  -- Loại thông báo (thích bài viết, bình luận, tin nhắn, v.v.)
    status VARCHAR(20) DEFAULT 'unread',  -- Trạng thái thông báo (đọc, chưa đọc)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Thời gian tạo thông báo
);
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,                               -- ID của bài viết (tự động tăng)
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Người đăng bài (liên kết với bảng users)
    content TEXT NOT NULL,                                -- Nội dung của bài viết
    
    visibility VARCHAR(15) DEFAULT 'public',              -- Sử dụng chuỗi (ví dụ 'public' hoặc 'private')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- Thời gian tạo bài viết
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        -- Thời gian cập nhật bài viết
);
CREATE TABLE post_images (
    id SERIAL PRIMARY KEY,                                 -- ID của ảnh (tự động tăng)
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,  -- Bài viết chứa ảnh
    image_url TEXT NOT NULL,                               -- URL ảnh
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        -- Thời gian thêm ảnh
);

CREATE TABLE saved_posts (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,  -- Bài viết được lưu
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Người lưu bài viết
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian lưu
    UNIQUE (post_id, user_id)  -- Đảm bảo mỗi người chỉ lưu 1 lần
);
CREATE TABLE post_reactions (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,  -- 'like', 'love', 'haha', 'wow', 'sad', 'angry'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (post_id, user_id)  -- Một user chỉ có thể react 1 lần trên 1 bài
);
CREATE TABLE comments (
    id SERIAL PRIMARY KEY, 
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,  -- Bình luận thuộc bài viết nào
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Người bình luận
    parent_id INT REFERENCES comments(id) ON DELETE CASCADE,  -- ID của bình luận cha (nếu là phản hồi)
    content TEXT NOT NULL,  -- Nội dung bình luận
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 
CREATE TABLE comment_reactions (
    id SERIAL PRIMARY KEY,
    comment_id INT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,  -- 'like', 'love', 'haha', 'sad', 'angry'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (comment_id, user_id)  -- 1 user chỉ có thể react 1 lần trên 1 comment
);

CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (post_id, user_id) -- Đảm bảo mỗi người chỉ like 1 lần
);

CREATE TABLE comment_reactions (
    id SERIAL PRIMARY KEY,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    reaction_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_comment_reaction UNIQUE (comment_id, user_id) -- Đảm bảo 1 user chỉ reaction 1 lần trên 1 comment
);
-- Thêm 50 người dùng vào bảng users
DO $$
BEGIN
    FOR i IN 1..50 LOOP
        INSERT INTO users (full_name, email, password, phone_number, avatar_url, nick_name, bio)
        VALUES 
        ('User ' || i, 
         'user' || i || '@example.com', 
         'password' || i, 
         '090' || LPAD(i::text, 7, '0'),  -- Sử dụng 7 chữ số sau '090' để đảm bảo tổng cộng là 10 ký tự
         'http://example.com/avatar' || i || '.jpg', 
         'nickname' || i, 
         'This is bio for user ' || i);
    END LOOP;
END $$;


DO $$
BEGIN
    FOR i IN 1..50 LOOP
        INSERT INTO friends (user_id, friend_id, status, created_at)
        VALUES 
        (i, (i % 50) + 1, 'accepted', CURRENT_TIMESTAMP);
    END LOOP;
END $$;

-- Thêm 50 bản ghi vào bảng notifications
DO $$
BEGIN
    FOR i IN 1..50 LOOP
        INSERT INTO notifications (user_id, message, type, status, created_at)
        VALUES 
        (i, 
         'Notification message for user ' || i, 
         'friend_request', 
         'unread', 
         CURRENT_TIMESTAMP);
    END LOOP;
END $$;



SELECT u1.full_name AS user_name, u2.full_name AS friend_name, f.status
FROM friends f
JOIN users u1 ON f.user_id = u1.id
JOIN users u2 ON f.friend_id = u2.id
WHERE f.status = 'pending';