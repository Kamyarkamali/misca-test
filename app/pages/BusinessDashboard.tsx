"use client";

interface BusinessDashboardProps {
  business: {
    id: string;
    name: string;
    slug: string;
    vatPercentage: number;
    logoUrl?: string;
    createdOn: number;
  };
}

export default function BusinessDashboard({
  business,
}: BusinessDashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{business.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">شناسه</p>
          <p>{business.slug}</p>
        </div>

        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">مالیات</p>
          <p>{business.vatPercentage}%</p>
        </div>
      </div>
    </div>
  );
}
