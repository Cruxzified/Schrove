import StudentsClient from './StudentsClient';
import { getStudents } from '@/lib/actions/students';
import { getBuses, getRoutes } from '@/lib/actions/buses';

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
  const [students, buses, routes] = await Promise.all([
    getStudents(),
    getBuses(),
    getRoutes()
  ]);

  return <StudentsClient initialStudents={students} buses={buses} routes={routes} />;
}
