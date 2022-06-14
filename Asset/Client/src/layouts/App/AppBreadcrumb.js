import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

const AppBreadcrumb = (props) => {
  const location = useLocation();
  const pathname = location.pathname;

  
  const temp = pathname.split('/')
  var paths = pathname.split('/')
  paths = paths.filter(item=>item!=="")
  let name = temp[1]
  if (props.routers) {
    let currentRouter = props.routers.find(
      (router) => router.path === pathname
    );
    name = currentRouter ? currentRouter.meta.breadcrumb[0].label : name;
  }

  return <span><span><Link to={"/"}>Home</Link></span>{paths.map((item,index)=><span key={index}> / <Link to={"/"+(paths.slice(0,index+1)).join('/')}>{item}</Link></span>)}</span>;
};

export default withRouter(AppBreadcrumb);
