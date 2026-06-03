import { useApp } from '../context/TaskContext';
import Navbar from '../components/Navbar';

function ProfilePage() {
  const { authUser } = useApp();
  if (!authUser) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div>
        <h1>My Profile</h1>
        <table border="1" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td>User ID</td>
              <td>{authUser.userId}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{authUser.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{authUser.email}</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>{authUser.role}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfilePage;