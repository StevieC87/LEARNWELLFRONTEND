import './userspage.css'

export default function UsersPage() {


  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h1>Users Page</h1>
      <p>This is the users page.</p>
      <p>Here you can manage users.</p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Name">John Doe</td>
            <td data-label="Age">28</td>
            <td data-label="City">New York</td>
          </tr>
          <tr>
            <td data-label="Name">Jane Smith</td>
            <td data-label="Age">32</td>
            <td data-label="City">Los Angeles</td>
          </tr>
          <tr>
            <td data-label="Name">Mike Johnson</td>
            <td data-label="Age">45</td>
            <td data-label="City">Chicago</td>
          </tr>
          <tr>
            <td data-label="Name">Emily Davis</td>
            <td data-label="Age">27</td>
            <td data-label="City">Houston</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}