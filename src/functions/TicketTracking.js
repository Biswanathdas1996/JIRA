import { decode } from "js-base64";
import { _fetch } from "../CONTRACT-ABI/connect";

export async function addTicketTracking(status, dragedCardIndex) {
  const prevTracking = await _fetch("tickets", Number(dragedCardIndex));
  let prevTrackingData =
    prevTracking?.tracking && JSON.parse(prevTracking?.tracking);
  prevTrackingData &&
    prevTrackingData.push({
      time: new Date(),
      status: status,
      updatedBy:
        localStorage.getItem("uid") && decode(localStorage.getItem("uid")),
    });
  return JSON.stringify(prevTrackingData);
}
