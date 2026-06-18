import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  addEquipment,
  deleteEquipment,
  markServiced,
  signOut,
} from "./actions";

type Equipment = {
  id: string;
  name: string;
  facility_name: string | null;
  last_serviced_on: string | null;
  interval_days: number;
};

// THE core idea: due-ness is COMPUTED from the stored facts, never stored.
// Change the interval or service date and the status recomputes for free —
// nothing can drift. This is MESync's "status is an output of structured data".
function dueInfo(row: Equipment): { due: boolean; label: string } {
  if (!row.last_serviced_on) {
    return { due: true, label: "never serviced" };
  }
  const dueDate = new Date(row.last_serviced_on);
  dueDate.setDate(dueDate.getDate() + row.interval_days);
  const due = dueDate.getTime() <= Date.now();
  return { due, label: `due ${dueDate.toISOString().slice(0, 10)}` };
}

export default async function HomePage() {
  const supabase = await createClient();

  // Auth gate: no session -> bounce to /login.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS means this query already only returns THIS user's rows. No WHERE owner
  // = ... needed in the app — the database enforces it.
  const { data: equipment } = await supabase
    .from("equipment")
    .select("id, name, facility_name, last_serviced_on, interval_days")
    .order("created_at", { ascending: true });

  const rows = (equipment ?? []) as Equipment[];

  return (
    <main>
      <div className="topbar">
        <div>
          <h1>Equipment service tracker</h1>
          <p className="muted">{user.email}</p>
        </div>
        <form action={signOut}>
          <button className="ghost">Sign out</button>
        </form>
      </div>

      <div className="panel">
        <form className="add-form" action={addEquipment}>
          <input className="full" name="name" placeholder="Equipment name" required />
          <input name="facility_name" placeholder="Facility / location" />
          <input
            name="interval_days"
            type="number"
            min={1}
            defaultValue={365}
            placeholder="Service interval (days)"
          />
          <input className="full" name="last_serviced_on" type="date" />
          <button className="full" type="submit">
            Add equipment
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="muted">No equipment yet. Add your first piece above.</p>
      ) : (
        <ul className="equipment">
          {rows.map((row) => {
            const { due, label } = dueInfo(row);
            return (
              <li className="row" key={row.id}>
                <div className="info">
                  <strong>{row.name}</strong>
                  <span className="muted">
                    {row.facility_name || "—"} · every {row.interval_days}d · {label}
                  </span>
                </div>
                <div className="actions">
                  <span className={`badge ${due ? "due" : "ok"}`}>
                    {due ? "DUE" : "OK"}
                  </span>
                  <form action={markServiced}>
                    <input type="hidden" name="id" value={row.id} />
                    <button className="ghost">Mark serviced</button>
                  </form>
                  <form action={deleteEquipment}>
                    <input type="hidden" name="id" value={row.id} />
                    <button className="ghost">✕</button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
