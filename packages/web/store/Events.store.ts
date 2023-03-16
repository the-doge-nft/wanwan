import { Eventable } from "../services/mixins/eventable";
import { EmptyClass } from "./../services/mixins/index";

export default class EventsStore extends Eventable(EmptyClass) {
  readonly events = {
    MEME_CREATED: "MEME_CREATED",
    COMPETITION_CREATED: "COMPETITION_CREATED",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    PROFILE_UPDATED: "PROFILE_UPDATED",
  };
}
