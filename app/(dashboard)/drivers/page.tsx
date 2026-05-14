import DriversClient from './DriversClient';
import { getDrivers } from '@/lib/actions/drivers';
import { getBuses, getRoutes } from '@/lib/actions/buses';

export const dynamic = 'force-dynamic';

export default async function DriversPage() {
  const [drivers, buses, routes] = await Promise.all([
    getDrivers(),
    getBuses(),
    getRoutes()
  ]);

  return <DriversClient initialDrivers={drivers} buses={buses} routes={routes} />;
}
