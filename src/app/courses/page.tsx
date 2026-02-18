'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Course {
  course_id: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string | null;
  hole_1_par: number;
  hole_2_par: number;
  hole_3_par: number;
  hole_4_par: number;
  hole_5_par: number;
  hole_6_par: number;
  hole_7_par: number;
  hole_8_par: number;
  hole_9_par: number;
  hole_10_par: number;
  hole_11_par: number;
  hole_12_par: number;
  hole_13_par: number;
  hole_14_par: number;
  hole_15_par: number;
  hole_16_par: number;
  hole_17_par: number;
  hole_18_par: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Format location string from city, state, country
  const formatLocation = (course: Course) => {
    const parts = [course.city, course.state, course.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '-';
  };

  // Calculate total par for a course
  const calculateTotalPar = (course: Course) => {
    const frontNine =
      course.hole_1_par + course.hole_2_par + course.hole_3_par +
      course.hole_4_par + course.hole_5_par + course.hole_6_par +
      course.hole_7_par + course.hole_8_par + course.hole_9_par;

    const backNine =
      course.hole_10_par + course.hole_11_par + course.hole_12_par +
      course.hole_13_par + course.hole_14_par + course.hole_15_par +
      course.hole_16_par + course.hole_17_par + course.hole_18_par;

    return {
      frontNine,
      backNine,
      total: frontNine + backNine
    };
  };

  // Fetch courses from API
  async function fetchCourses() {
    try {
      const res = await fetch('/api/courses/all');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  useEffect(() => {
    async function initialFetch() {
      await fetchCourses();
      setLoading(false);
    }

    initialFetch();
  }, []);

  const handleAddCourse = () => {
    // Navigate to add course page or open modal
    window.location.href = '/courses/new';
  };

  const handleEditCourse = (courseId: string) => {
    // Navigate to edit course page
    //window.location.href = `/courses/${courseId}/edit`;
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!confirm(`Are you sure you want to delete "${courseName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchCourses();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Manage golf courses</p>
          </div>
          <Button onClick={handleAddCourse} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>

        {/* Courses Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Course Name</TableHead>
                <TableHead className="min-w-[150px]">Location</TableHead>
                <TableHead className="text-center min-w-[40px]">1</TableHead>
                <TableHead className="text-center min-w-[40px]">2</TableHead>
                <TableHead className="text-center min-w-[40px]">3</TableHead>
                <TableHead className="text-center min-w-[40px]">4</TableHead>
                <TableHead className="text-center min-w-[40px]">5</TableHead>
                <TableHead className="text-center min-w-[40px]">6</TableHead>
                <TableHead className="text-center min-w-[40px]">7</TableHead>
                <TableHead className="text-center min-w-[40px]">8</TableHead>
                <TableHead className="text-center min-w-[40px]">9</TableHead>
                <TableHead className="text-center font-semibold bg-muted min-w-[50px]">Out</TableHead>
                <TableHead className="text-center min-w-[40px]">10</TableHead>
                <TableHead className="text-center min-w-[40px]">11</TableHead>
                <TableHead className="text-center min-w-[40px]">12</TableHead>
                <TableHead className="text-center min-w-[40px]">13</TableHead>
                <TableHead className="text-center min-w-[40px]">14</TableHead>
                <TableHead className="text-center min-w-[40px]">15</TableHead>
                <TableHead className="text-center min-w-[40px]">16</TableHead>
                <TableHead className="text-center min-w-[40px]">17</TableHead>
                <TableHead className="text-center min-w-[40px]">18</TableHead>
                <TableHead className="text-center font-semibold bg-muted min-w-[50px]">In</TableHead>
                <TableHead className="text-center font-bold bg-primary text-primary-foreground min-w-[60px]">Total</TableHead>
                <TableHead className="sticky right-0 bg-background z-10 text-center min-w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={24} className="text-center text-muted-foreground py-8">
                    <div className="flex flex-col items-center gap-2">
                      <p>No courses yet</p>
                      <Button onClick={handleAddCourse} variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Course
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => {
                  const { frontNine, backNine, total } = calculateTotalPar(course);

                  return (
                    <TableRow key={course.course_id}>
                      <TableCell className="sticky left-0 bg-background z-10 font-medium">
                        {course.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatLocation(course)}
                      </TableCell>
                      <TableCell className="text-center">{course.hole_1_par}</TableCell>
                      <TableCell className="text-center">{course.hole_2_par}</TableCell>
                      <TableCell className="text-center">{course.hole_3_par}</TableCell>
                      <TableCell className="text-center">{course.hole_4_par}</TableCell>
                      <TableCell className="text-center">{course.hole_5_par}</TableCell>
                      <TableCell className="text-center">{course.hole_6_par}</TableCell>
                      <TableCell className="text-center">{course.hole_7_par}</TableCell>
                      <TableCell className="text-center">{course.hole_8_par}</TableCell>
                      <TableCell className="text-center">{course.hole_9_par}</TableCell>
                      <TableCell className="text-center font-semibold bg-muted">
                        {frontNine}
                      </TableCell>
                      <TableCell className="text-center">{course.hole_10_par}</TableCell>
                      <TableCell className="text-center">{course.hole_11_par}</TableCell>
                      <TableCell className="text-center">{course.hole_12_par}</TableCell>
                      <TableCell className="text-center">{course.hole_13_par}</TableCell>
                      <TableCell className="text-center">{course.hole_14_par}</TableCell>
                      <TableCell className="text-center">{course.hole_15_par}</TableCell>
                      <TableCell className="text-center">{course.hole_16_par}</TableCell>
                      <TableCell className="text-center">{course.hole_17_par}</TableCell>
                      <TableCell className="text-center">{course.hole_18_par}</TableCell>
                      <TableCell className="text-center font-semibold bg-muted">
                        {backNine}
                      </TableCell>
                      <TableCell className="text-center font-bold bg-primary text-primary-foreground">
                        {total}
                      </TableCell>
                      <TableCell className="sticky right-0 bg-background z-10">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCourse(course.course_id)}
                            title="Edit course"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCourse(course.course_id, course.name)}
                            title="Delete course"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}