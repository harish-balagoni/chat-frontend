import { BiArchiveIn } from "react-icons/bi";
import {BsChatDots} from "react-icons/bs";
import {BsPeopleFill} from "react-icons/bs";

export const SideBarData = [
  {
    title: 'Conversations',
    path: '/chats',
    icon: <BsChatDots />,
    cName: 'nav-text'
  },
  {
    title: 'Contacts',
    path: '/contacts',
    icon: <BsPeopleFill/>,
    cName: 'nav-text'
  },
  {
    title: 'Archived Chats',
    path: '/Archived',
    icon: <BiArchiveIn />,
    cName: 'nav-text'
  }
];
