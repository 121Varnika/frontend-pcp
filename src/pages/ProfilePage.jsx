// Profile page — simple black and white
import { useApp } from '../context/TaskContext';
import Navbar from '../components/Navbar';

function ProfilePage() {
  const { authUser } = useApp();
  if (!authUser) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <h1>My Profile</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <tbody>
            <tr><td style={th}>User ID</td><td style={td}>{authUser.userId}</td></tr>
            <tr><td style={th}>Name</td><td style={td}>{authUser.name}</td></tr>
            <tr><td style={th}>Email</td><td style={td}>{authUser.email}</td></tr>
            <tr><td style={th}>Role</td><td style={td}>{authUser.role}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = { border: '1px solid #000', padding: '8px', fontWeight: 'bold', background: '#eee' };
const td = { border: '1px solid #000', padding: '8px' };

export default ProfilePage;