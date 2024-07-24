import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery /*PaginatedCourseQuery*/ } from './course.query';
import { SortQuery } from './sort.query';

@Injectable()
export class CourseService {
  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return await Course.create({
      ...createCourseDto,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    Object.keys(courseQuery).forEach((key) => {
      courseQuery[key] = ILike(`%${courseQuery[key]}%`);
    });
    return await Course.find({
      where: courseQuery,
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    });
  }

  async findAllSortedByName(sortQuery: SortQuery): Promise<Course[]> {
    Object.keys(sortQuery).forEach((key) => {
      sortQuery[key] = ILike(`%${sortQuery[key]}%`);
    });
    return await Course.find({
      order: {
        name: 'DESC',
      },
    });
  }

  /*async findAllPaginated(courseQuery: PaginatedCourseQuery): Promise<Course[]> {
    //Set page number to index for multiplying it * the number of values setted in size.
    const pageIndex = courseQuery.page - 1;

    //Multiply pageIndex * the number of values setted in size.
    const numberOfValuesToSkip = courseQuery.size * pageIndex;
    return await Course.find({
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    });
  }*/

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    return await Course.create({ id: course.id, ...updateCourseDto }).save();
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await Course.delete(course);
    return id;
  }

  async count(): Promise<number> {
    return await Course.count();
  }
}
