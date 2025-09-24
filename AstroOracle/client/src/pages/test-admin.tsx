export default function TestAdmin() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '100px 20px', 
      backgroundColor: 'black', 
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '48px', color: 'yellow', marginBottom: '20px' }}>
        ✅ ADMIN DASHBOARD WORKING!
      </h1>
      <p style={{ fontSize: '20px', color: 'white' }}>
        This proves the routing is working correctly.
      </p>
      <div style={{ marginTop: '40px' }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '20px', 
          backgroundColor: '#333', 
          margin: '10px',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: 'lime' }}>Total Users: 156</h3>
        </div>
        <div style={{ 
          display: 'inline-block', 
          padding: '20px', 
          backgroundColor: '#333', 
          margin: '10px',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: 'cyan' }}>Revenue: ₹48,500</h3>
        </div>
      </div>
    </div>
  );
}