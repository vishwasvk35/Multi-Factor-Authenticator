import { useAuthStore } from "../store/AuthStore";
import Button from "../components/Button";

const DashboardPage = () => {
  const {user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="bg-slate-900 p-7 bg-opacity-30 border-gray-800 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-4xl font-medium text-center mb-7 text-blue-500 mb-6text-center">
        Dashboard
      </h2>

      <div>
        <div className="my-7">
          <h3 className="text-xl font-medium text-blue-500 mb-6 text-center">
            Profile Information
          </h3>
          <p className="text-gray-300 ">Name: {user?.name}</p>
          <p className="text-gray-300 ">Email: {user?.email}</p>
        </div>
        <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 mb-7">
          <h3 className="text-xl font-semibold text-blue-400 mb-3">
            Account Activity
          </h3>
          <p className="text-gray-300">
            <span className="font-bold">Joined: </span>
            {new Date(user?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-300">
            <span className="font-bold">Last Login: </span>
            {user?.lastLogin}
          </p>
        </div>

        <div onClick={handleLogout}>
          <Button  type="button" placeholder="Logout" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
