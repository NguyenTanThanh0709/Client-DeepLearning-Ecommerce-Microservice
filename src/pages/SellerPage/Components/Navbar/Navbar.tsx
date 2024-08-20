import React from "react";
import { useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
 
export default function  Navbar() {
  const [open, setOpen] = React.useState(0);
  const navigate = useNavigate();
 
  const handleOpen = (value: any) => {
    setOpen(open === value ? 0 : value);
  };
 
  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Quản Lý Shop
        </Typography>
      </div>
      <List>
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
            />
          }
        >
                  <ListItem onClick={() => navigate('/')}>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Trang chủ
        </ListItem>
          <ListItem className="p-0" selected={open === 1} >
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Đơn Hàng
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem onClick={() => navigate('/seller/order')}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Tất cả
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>

        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 2}>
            <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
              <ListItemPrefix>
                <ShoppingBagIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Sản Phẩm
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem onClick={() => navigate('/seller/product/list')}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Tất cả
              </ListItem>
              <ListItem onClick={() => navigate('/seller/product/0')}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Thêm sản phẩm
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>


        <Accordion
          open={open === 3}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${open === 3 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 3}>
            <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3">
              <ListItemPrefix>
                <CreditCardIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Khuyến mãi
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem onClick={() => navigate('/seller-list-promotion')}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Tất cả
              </ListItem>
              <ListItem onClick={() => navigate('/seller-promiton/0')}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Thêm Khuyến mãi
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>


        <ListItem onClick={() => navigate('/seller/product/shipping')}>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Vận chuyển
        </ListItem>
        <ListItem onClick={() => navigate('/seller-shop/0')}>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile Shop
        </ListItem>
        <ListItem onClick={() => navigate('/seller/product/revenue')}>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Doanh thu
        </ListItem>
        <ListItem onClick={() => navigate('/logout')}>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}