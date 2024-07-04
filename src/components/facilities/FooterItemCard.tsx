
const companyInfo = {
    heading: "Company",
    list: ["About Us", "Packages", "Facilities", "News and Blogs"],
  };

const FooterItemCard = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold ">{companyInfo.heading}</h3>
      <ul className="flex flex-col justify-between">
        {companyInfo.list.map((item, i) => {
          return (
            <>
              <li className="" key={i + item}>
                {item}
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};

export default FooterItemCard;
