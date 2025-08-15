
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from 'jsonwebtoken';

export default async function Layout({ children }) {

  //, here we only want superadmin to have access to settings
  const cookieStore = await cookies(); // Valid in Server Component
  // console.log('All cookies:', cookieStore.getAll());

  // console.log('cookieStore', cookieStore);
  const token = cookieStore.get('token')?.value;
  // console.log('token', token);
  //console.log('refreshToken', refreshToken);
  if (token) {
    try {
      verify(token, process.env.JWT_SECRET);
      const decoded = verify(token, process.env.JWT_SECRET);
      console.log('decoded', decoded);
      //now refresh

      const decodedissuedat = decoded.iat;
      const userrole = decoded.role;
      console.log('userrole', userrole);

      if (userrole !== 'superadmin') {
        console.log('User does not have access to settings');
        redirect('/dash');
      }

    } catch (err) {
      redirect('/users/login');
    }





  }
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}