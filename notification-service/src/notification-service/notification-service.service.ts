import { Injectable } from '@nestjs/common';
import { CreateNotificationServiceDto } from './dto/create-notification-service.dto';
import { UpdateNotificationServiceDto } from './dto/update-notification-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationServiceService {

  constructor(private readonly prismaService: PrismaService) {}

  // Thêm thông báo mới
  async createNotification(data: { user_id: number; message: string; type: string }) {
      try {
          console.log('📩 Nhận dữ liệu:', data);

          if (!data.user_id) {
              throw new Error('❌ user_id bị undefined!');
          }

          const response = await this.prismaService.notifications.create({
              data: {
                  user_id: data.user_id,
                  message: data.message,
                  type: data.type,
                  status: 'unread',
              },
          });

          console.log('✅ Thêm thông báo thành công!');
          return response;
      } catch (e) {
          console.error('❌ Lỗi khi thêm thông báo:', e);
          return e;
      }
  }

  // Lấy tất cả thông báo của user và xóa thông báo đã đọc
  async findAll(userId: number) {
      try {
          console.log('📩 Lấy thông báo cho user:', userId);

          // Lấy tất cả thông báo chưa đọc của user
          const notifications = await this.prismaService.notifications.findMany({
              where: { user_id: userId },
              orderBy: { created_at: 'desc' }, // Sắp xếp theo thời gian mới nhất
          });

          console.log('✅ Lấy thông báo thành công!');

          // Xóa tất cả thông báo đã đọc
          await this.prismaService.notifications.deleteMany({
              where: {
                  user_id: userId,
                  status: 'read',
              },
          });

          console.log('🗑️ Đã xóa các thông báo đã đọc.');

          return notifications;
      } catch (e) {
          console.error('❌ Lỗi khi lấy thông báo:', e);
          return e;
      }
  }
  // Cập nhật trạng thái thông báo thành "read"
async markAsRead(notificationId: number) {
  try {
      console.log(`📩 Đánh dấu thông báo ${notificationId} là "read"`);

      const updatedNotification = await this.prismaService.notifications.update({
          where: { id: notificationId },
          data: { status: 'read' },
      });

      console.log('✅ Cập nhật trạng thái thông báo thành công!');
      return updatedNotification;
  } catch (e) {
      console.error('❌ Lỗi khi cập nhật trạng thái thông báo:', e);
      return e;
  }
}
}
