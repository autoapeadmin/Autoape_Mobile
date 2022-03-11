export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  Login: undefined;
  List: undefined;
  ListMoto: undefined;
  NewCar: undefined;
  Search: undefined;
  WantedList: undefined;
  SearchTwo: undefined;
  VehicleDetails: undefined;
  WantedCreate: undefined;
  ContactListScreen:undefined;
  DealershipDetails:undefined;
  EvCharger:undefined;
  MyListing:undefined;
  TrafficCamera:undefined;
};

export type LoginStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  AddList: undefined;
};

export type NewsCarStackParamList = {
  NewModelScreen: undefined;
  SubModelScreen: undefined;
  NewCarDetail: undefined;
};

export type ListCarStackParamList = {
  CheckRego: undefined;
};

export type WantedListStackParamList = {
  WantedCreate: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Nearby: undefined;
  AddList: undefined;
  Search: undefined;
  Menu: undefined;
  News: undefined;
};

export type HomeParamList = {
  Home: undefined;
  CarDetails: undefined;
  DealershipDetails: undefined;
  AgentDetails: undefined;
};

export type NearbyParamList = {
  NearbyScreen: undefined;
  DealershipDetails: undefined;
  AgentDetails: undefined;
  CarDetails: undefined;
};

export type AddListParamList = {
  AddListScreen: undefined;
  Login: undefined;
  List: undefined;
  ListMoto: undefined;
};

export type SearchParamList = {
  SearchScreen: undefined;
};

export type NewsParamList = {
  NewsScreen: undefined;
};

export type MenuParamList = {
  MenuScreen: undefined;
  WantedListScreen: undefined;
  ContactListScreen: undefined;
  DealershipDetails:undefined;
  EvCharger:undefined;
  MyListing:undefined;
  SalesAgreement:undefined;
  TrafficCamera:undefined;
};

export type Vehicle = {
  make_description: string;
  model_desc: string;
  vehicule_color: string;
  vehicule_door: string;
  vehicule_engine: string;
  vehicule_fuel: string;
  vehicule_odometer: string;
  vehicule_rego: string;
  vehicule_seat: string;
  vehicule_year: string;
  DealershipDetails: string;
};

export declare type newCar = {
  make_description: string;
  model: string;
  submodel: string;
  url_image: string;
};
