import React, { useEffect, useRef } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { removeOldestNews, addNews } from "../redux/newsSlice";
import { Button } from "react-bootstrap";

export function News() {
  const newsTotal = useSelector((state: RootState) => state.news.total);
  const newsItems = useSelector((state: RootState) => state.news.items);
  const dispatch = useDispatch();

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setTimeout(() => {
      dispatch(removeOldestNews());
    }, 18000);
  }, [newsTotal, dispatch]);

  return (
    <div
      className="news-scroller"
      style={{
        position: "absolute",
        marginTop: "0",
        marginLeft: "0",
        width: "100vw",
      }}
    >
      <div className="news">
        {newsItems.length ? newsItems[0] : "The world is quiet"}
      </div>
    </div>
  );
}
