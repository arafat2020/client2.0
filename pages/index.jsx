import { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import SwipeableTemporaryDrawer from "../components/SwipeableTemporaryDrawer";
import { UserContext } from "../state/stateprovider";
import { useRouter } from "next/router";
import Chat from "../components/Chat";
import DialogBox from "../components/Dialog/Dialog";

export default function Home() {
  const ctx = useContext(UserContext);
  const [load, setLoad] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (ctx.user) {
      setLoad(false);
    } else {
      router.push("/login");
    }
  }, [ctx.user, router]);
  return (
    <div>
      {load ? (
        <Spinner />
      ) : (
        <div className="main">
          <Nav />
            <SwipeableTemporaryDrawer />
            <div className="container">
              <Chat />
              <DialogBox />
            </div>
        </div>
      )}
    </div>
  );
}
