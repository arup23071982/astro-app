function AdminWorking() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '80px 20px 20px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            color: '#ffd700', 
            marginBottom: '20px',
            textShadow: '0 0 20px #ffd700'
          }}>
            🎯 ADMIN DASHBOARD IS WORKING! 
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#cccccc' }}>
            Welcome to Jai Guru Astro Remedy Admin Panel
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '10px',
            border: '2px solid #333',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#00ff00', fontSize: '1.5rem', marginBottom: '10px' }}>Total Users</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffffff' }}>156</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>+12% this month</p>
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '10px',
            border: '2px solid #333',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#00bfff', fontSize: '1.5rem', marginBottom: '10px' }}>Monthly Revenue</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffffff' }}>₹48,500</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>+18% this month</p>
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '10px',
            border: '2px solid #333',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ff6b6b', fontSize: '1.5rem', marginBottom: '10px' }}>Consultations</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffffff' }}>89</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>+8% this month</p>
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '10px',
            border: '2px solid #333',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ff9500', fontSize: '1.5rem', marginBottom: '10px' }}>Home Tuitions</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffffff' }}>23</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>+15% this month</p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '25px',
            borderRadius: '10px',
            border: '2px solid #333',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2a2a2a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1a1a1a'}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#ffd700' }}>👥 Client Management</h3>
            <p style={{ color: '#aaa', fontSize: '0.95rem' }}>Manage user accounts, profiles, and customer data</p>
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '25px',
            borderRadius: '10px',
            border: '2px solid #333',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2a2a2a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1a1a1a'}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#ffd700' }}>📱 Consultations</h3>
            <p style={{ color: '#aaa', fontSize: '0.95rem' }}>View and manage all consultation bookings</p>
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '25px',
            borderRadius: '10px',
            border: '2px solid #333',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2a2a2a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1a1a1a'}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#ffd700' }}>📚 Course Management</h3>
            <p style={{ color: '#aaa', fontSize: '0.95rem' }}>Create and manage astrology courses</p>
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '25px',
            borderRadius: '10px',
            border: '2px solid #333',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2a2a2a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1a1a1a'}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#ffd700' }}>🛍️ Products & Orders</h3>
            <p style={{ color: '#aaa', fontSize: '0.95rem' }}>Manage gemstones and remedy products</p>
          </div>
        </div>


      </div>
    </div>
  );
}

export default AdminWorking;