const styles = {
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    background: "#1976d2",
    color: "white",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
  },
};

export default function PatientTable({ patients }) {
  return (
    <div
      style={{
        background: "white",
        marginTop: "30px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2>📋 Patient List</h2>

      {patients.length === 0 ? (
        <p>No patients available.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Symptoms</th>
              <th style={styles.th}>Wait Time</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient, index) => (
              <tr key={index}>
                <td style={styles.td}>{patient.name}</td>
                <td style={styles.td}>{patient.symptoms}</td>
                <td style={styles.td}>{patient.waitTime} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
