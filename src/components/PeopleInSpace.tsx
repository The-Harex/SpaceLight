import { User } from 'lucide-react';

async function getPeople() {
  try {
    const res = await fetch('http://api.open-notify.org/astros.json', { cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (e) {
    return { number: 0, people: [] };
  }
}

export default async function PeopleInSpace() {
  const data = await getPeople();

  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-purple-300 flex items-center gap-2">
        <User className="w-5 h-5" /> Humans in Space ({data.number})
      </h2>
      <ul className="space-y-2">
        {data.people.map((person: any, i: number) => (
          <li key={i} className="flex items-center justify-between text-sm text-slate-300 bg-slate-800/40 p-2 rounded">
            <span>{person.name}</span>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-full">{person.craft}</span>
          </li>
        ))}
        {data.people.length === 0 && <li className="text-slate-500">No data available</li>}
      </ul>
    </div>
  );
}
