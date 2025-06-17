import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue, QueueStatus } from './entities/queue.entity';
import { Student } from '../users/entities/student.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async addToQueue(vendorId: string, studentId: string, transactionId: string): Promise<Queue> {
    // Check if student is already in any queue
    const existingQueue = await this.queueRepository.findOne({
      where: { studentId }
    });

    // If student is already in a queue, return the existing queue entry
    if (existingQueue) {
      return existingQueue;
    }

    // Get the last position in the vendor's queue
    const lastQueue = await this.queueRepository.findOne({
      where: { vendorId },
      order: { position: 'DESC' }
    });

    // Calculate the new position
    const position = lastQueue ? lastQueue.position + 1 : 1;

    // Create new queue entry
    const queue = this.queueRepository.create({
      vendorId,
      studentId,
      transactionId,
      position,
      status: QueueStatus.PENDING
    });

    return this.queueRepository.save(queue);
  }

  async getQueuePosition(studentId: string): Promise<number> {
    const queue = await this.queueRepository.findOne({
      where: { studentId }
    });

    if (!queue) {
      throw new NotFoundException('Student is not in any queue');
    }

    return queue.position;
  }

  async getVendorQueue(vendorId: string): Promise<Queue[]> {
    return this.queueRepository.find({
      where: { vendorId },
      order: { position: 'ASC' },
      relations: {
        student: true
      },
      select: {
        id: true,
        vendorId: true,
        studentId: true,
        transactionId: true,
        status: true,
        position: true,
        createdAt: true,
        servedAt: true,
        student: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          studentId: true,
          createdAt: true,
          updatedAt: true
        }
      }
    });
  }

  async completeCurrent(vendorId: string): Promise<Queue> {
    // Get current serving student
    const currentServing = await this.queueRepository.findOne({
      where: {
        vendorId,
        status: QueueStatus.SERVING
      }
    });

    if (!currentServing) {
      throw new NotFoundException('No student is currently being served');
    }

    // Mark current student as completed
    currentServing.status = QueueStatus.COMPLETED;
    currentServing.servedAt = new Date();
    await this.queueRepository.save(currentServing);

    // Get next student in queue
    const nextInLine = await this.queueRepository.findOne({
      where: {
        vendorId,
        status: QueueStatus.PENDING
      },
      order: { position: 'ASC' }
    });

    if (nextInLine) {
      // Update next student to serving
      nextInLine.status = QueueStatus.SERVING;
      nextInLine.servedAt = new Date();
      await this.queueRepository.save(nextInLine);
    }

    return currentServing;
  }

  async getCurrentServing(vendorId: string): Promise<Queue | null> {
    return this.queueRepository.findOne({
      where: {
        vendorId,
        status: QueueStatus.SERVING
      },
      relations: ['student']
    });
  }

  async completeStudent(vendorId: string, studentEmail: string): Promise<Queue> {
    // Find the student by email
    const student = await this.studentRepository.findOne({
      where: { email: studentEmail }
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Find the queue entry for this student and vendor
    const queueEntry = await this.queueRepository.findOne({
      where: {
        vendorId,
        studentId: student.id,
        status: QueueStatus.PENDING
      }
    });

    if (!queueEntry) {
      throw new NotFoundException('Student is not in your queue');
    }

    // Delete the queue entry
    await this.queueRepository.remove(queueEntry);

    // Get next student in queue
    const nextInLine = await this.queueRepository.findOne({
      where: {
        vendorId,
        status: QueueStatus.PENDING
      },
      order: { position: 'ASC' }
    });

    if (nextInLine) {
      // Update next student to serving
      nextInLine.status = QueueStatus.SERVING;
      nextInLine.servedAt = new Date();
      await this.queueRepository.save(nextInLine);
    }

    return queueEntry;
  }
} 