import { Redirect, Route } from "react-router";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import Home from "../tabs/Home";
import Bookmark from "../tabs/Bookmark";
import Post from "../tabs/Post";
import Message from "../tabs/Message";
import Profile from "../tabs/Profile";

import SearchIcon from "../assets/svgs/search.svg";
import SearchLineIcon from "../assets/svgs/search-line.svg";
import HeartIcon from "../assets/svgs/double-heart.svg";
import HeartLineIcon from "../assets/svgs/heart-line.svg";
import PlusIcon from "../assets/svgs/plus-circle.svg";
import PlusLineIcon from "../assets/svgs/plus-circle-line.svg";
import MessageIcon from "../assets/svgs/message.svg";
import MessageLineIcon from "../assets/svgs/message-line.svg";
import ProfileIcon from "../assets/svgs/user.svg";
import ProfileLineIcon from "../assets/svgs/user-line.svg";
import { useState } from "react";

const NavigationBar = () => {
  const [currentTab, setCurrentTab] = useState("home");

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/bookmark">
          <Bookmark />
        </Route>
        <Route path="/post">
          <Post />
        </Route>
        <Route path="/message">
          <Message />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar
        slot="bottom"
        defaultValue="home"
        onIonTabsDidChange={(event) => setCurrentTab(event.detail.tab)}
      >
        <IonTabButton tab="home" href="/home">
          <IonIcon
            aria-hidden="true"
            className="svg-lg"
            src={currentTab === "home" ? SearchIcon : SearchLineIcon}
          />
          <IonLabel
            className={`font-caption3 ${
              currentTab === "home" ? "text-orange5" : "text-gray6"
            }`}
          >
            둘러보기
          </IonLabel>
        </IonTabButton>
        <IonTabButton tab="bookmark" href="/bookmark">
          <IonIcon
            aria-hidden="true"
            className="svg-lg"
            src={currentTab === "bookmark" ? HeartIcon : HeartLineIcon}
          />
          <IonLabel
            className={`font-caption3 ${
              currentTab === "bookmark" ? "text-orange5" : "text-gray6"
            }`}
          >
            관심 목록
          </IonLabel>
        </IonTabButton>
        <IonTabButton tab="post" href="/post">
          <IonIcon
            aria-hidden="true"
            className="svg-lg"
            src={currentTab === "post" ? PlusIcon : PlusLineIcon}
          />
          <IonLabel
            className={`font-caption3 ${
              currentTab === "post" ? "text-orange5" : "text-gray6"
            }`}
          >
            장소 올리기
          </IonLabel>
        </IonTabButton>
        <IonTabButton tab="message" href="/message">
          <IonIcon
            aria-hidden="true"
            className="svg-lg"
            src={currentTab === "message" ? MessageIcon : MessageLineIcon}
          />
          <IonLabel
            className={`font-caption3 ${
              currentTab === "message" ? "text-orange5" : "text-gray6"
            }`}
          >
            쪽지
          </IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <IonIcon
            aria-hidden="true"
            className="svg-lg"
            src={currentTab === "profile" ? ProfileIcon : ProfileLineIcon}
          />
          <IonLabel
            className={`font-caption3 ${
              currentTab === "profile" ? "text-orange5" : "text-gray6"
            }`}
          >
            마이페이지
          </IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default NavigationBar;
