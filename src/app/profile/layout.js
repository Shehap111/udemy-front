
// app/profile/layout.js
import Sidebar from './Sidebar';
import IntroSections from "../../components/IntroSections";


export default function ProfileLayout({ children }) {
  return (
    <div className=''>
  <IntroSections path='profile' Link='profile' sectionName='Profile' />
<div className='container profile' >

<div className='row'>

<div className='col-lg-3 col-md-4'><Sidebar /></div>
<div className='col-lg-9 col-md-8'><div style={{ flex: 1 }}>{children}</div></div>
        
</div>        

</div>
  
  
    </div>
  );
}
