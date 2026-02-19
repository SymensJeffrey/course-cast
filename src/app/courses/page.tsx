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
import { Modal } from '@/components/Modal'; // adjust path as needed

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

const DEFAULT_FORM = {
  name: '',
  city: '',
  state: '',
  country: '',
  hole_1_par: 4, hole_2_par: 4, hole_3_par: 4,
  hole_4_par: 4, hole_5_par: 4, hole_6_par: 4,
  hole_7_par: 4, hole_8_par: 4, hole_9_par: 4,
  hole_10_par: 4, hole_11_par: 4, hole_12_par: 4,
  hole_13_par: 4, hole_14_par: 4, hole_15_par: 4,
  hole_16_par: 4, hole_17_par: 4, hole_18_par: 4,
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);

  const formatLocation = (course: Course) => {
    const parts = [course.city, course.state, course.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '-';
  };

  const calculateTotalPar = (course: Course) => {
    const frontNine =
      course.hole_1_par + course.hole_2_par + course.hole_3_par +
      course.hole_4_par + course.hole_5_par + course.hole_6_par +
      course.hole_7_par + course.hole_8_par + course.hole_9_par;
    const backNine =
      course.hole_10_par + course.hole_11_par + course.hole_12_par +
      course.hole_13_par + course.hole_14_par + course.hole_15_par +
      course.hole_16_par + course.hole_17_par + course.hole_18_par;
    return { frontNine, backNine, total: frontNine + backNine };
  };

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

  const handleOpenModal = () => {
    setForm(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert('Course name is required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/courses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchCourses();
        handleCloseModal();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCourse = (courseId: string) => {
    // window.location.href = `/courses/${courseId}/edit`;
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!confirm(`Are you sure you want to delete "${courseName}"?`)) return;
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
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

  const holeNumbers = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Manage golf courses</p>
          </div>
          <Button onClick={handleOpenModal} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>

        {/* Add Course Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add Course">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            {/* Course Info */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Pebble Beach Golf Links"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['city', 'state', 'country'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize mb-1">{field}</label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                </div>
              ))}
            </div>

            {/* Par Inputs — Front 9 */}
            <div>
              <p className="text-sm font-semibold mb-2">Front 9 — Par</p>
              <div className="grid grid-cols-9 gap-4">
                {holeNumbers.slice(0, 9).map((hole) => {
                  const key = `hole_${hole}_par` as keyof typeof form;
                  return (
                    <div key={hole} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{hole}</p>
                      <input
                        type="number"
                        min={3}
                        max={5}
                        value={form[key]}
                        onChange={(e) => handleFormChange(key, parseInt(e.target.value) || 4)}
                        className="w-full border rounded px-1 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Par Inputs — Back 9 */}
            <div>
              <p className="text-sm font-semibold mb-2">Back 9 — Par</p>
              <div className="grid grid-cols-9 gap-4">
                {holeNumbers.slice(9, 18).map((hole) => {
                  const key = `hole_${hole}_par` as keyof typeof form;
                  return (
                    <div key={hole} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{hole}</p>
                      <input
                        type="number"
                        min={3}
                        max={5}
                        value={form[key]}
                        onChange={(e) => handleFormChange(key, parseInt(e.target.value) || 4)}
                        className="w-full border rounded px-1 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total preview */}
            <div className="flex justify-between text-sm bg-muted rounded-md px-3 py-2">
              <span>
                Out: <strong>
                  {holeNumbers.slice(0, 9).reduce((sum, h) => sum + (Number(form[`hole_${h}_par` as keyof typeof form]) || 0), 0)}
                </strong>
              </span>
              <span>
                In: <strong>
                  {holeNumbers.slice(9, 18).reduce((sum, h) => sum + (Number(form[`hole_${h}_par` as keyof typeof form]) || 0), 0)}
                </strong>
              </span>
              <span>
                Total: <strong>
                  {holeNumbers.reduce((sum, h) => sum + (Number(form[`hole_${h}_par` as keyof typeof form]) || 0), 0)}
                </strong>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
            <Button variant="outline" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Course'}
            </Button>
          </div>
        </Modal>

        {/* Courses Table — unchanged */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Course Name</TableHead>
                <TableHead className="min-w-[150px]">Location</TableHead>
                {Array.from({ length: 9 }, (_, i) => (
                  <TableHead key={i + 1} className="text-center min-w-[40px]">{i + 1}</TableHead>
                ))}
                <TableHead className="text-center font-semibold bg-muted min-w-[50px]">Out</TableHead>
                {Array.from({ length: 9 }, (_, i) => (
                  <TableHead key={i + 10} className="text-center min-w-[40px]">{i + 10}</TableHead>
                ))}
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
                      <Button onClick={handleOpenModal} variant="outline">
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
                      <TableCell className="sticky left-0 bg-background z-10 font-medium">{course.name}</TableCell>
                      <TableCell className="text-muted-foreground">{formatLocation(course)}</TableCell>
                      {holeNumbers.slice(0, 9).map((h) => (
                        <TableCell key={h} className="text-center">{course[`hole_${h}_par` as keyof Course]}</TableCell>
                      ))}
                      <TableCell className="text-center font-semibold bg-muted">{frontNine}</TableCell>
                      {holeNumbers.slice(9, 18).map((h) => (
                        <TableCell key={h} className="text-center">{course[`hole_${h}_par` as keyof Course]}</TableCell>
                      ))}
                      <TableCell className="text-center font-semibold bg-muted">{backNine}</TableCell>
                      <TableCell className="text-center font-bold bg-primary text-primary-foreground">{total}</TableCell>
                      <TableCell className="sticky right-0 bg-background z-10">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course.course_id)} title="Edit course">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
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