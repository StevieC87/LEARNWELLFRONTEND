
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

export default function UserProfile() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const onSubmit = data => {
    console.log(data)
  };
  const currentuserrole = useSelector((state) => state.DashSlice.userrole);
  alert(currentuserrole)
  useEffect(() => {
    const asyncfunctionfetchuserprofile = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/userprofile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('User profile data:', data);
        setValue('username', data.username);
        setValue('email', data.email);
        setValue('userrole', data.userrole);
      } else {
        console.error('Failed to fetch user profile:', response.statusText);
      }
    }
    asyncfunctionfetchuserprofile();
  }, [setValue]); */

  return (
    <div>helllo</div>
    /*    <form onSubmit={handleSubmit(onSubmit)}>
         <input placeholder="Username" {...register("username", { required: true })} />
         <input placeholder="Email Address" type="email" {...register("email", { required: true })} />
         <input placeholder="Password" type="password" {...register("password", { required: true })} />
   
         <select {...register("userrole", { required: true })}>
           <option value="">Select role</option>
           <option value="admin">Admin</option>
           <option value="user">User</option>
         </select>
         <button type="submit">Save</button>
       </form> */
  )
}