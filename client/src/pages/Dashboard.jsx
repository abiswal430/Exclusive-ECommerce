export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.username}
      </h1>
    </div>
  );
}