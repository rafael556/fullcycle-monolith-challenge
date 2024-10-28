import ValueObject from "../../../@shared/domain/value-object/value-object.interface";

type AddressProps = {
    street: string;
    number: number;
    zipcode: string;
    city: string;
}

export default class Address implements ValueObject {
    _street: string = "";
    _number: number = 0;
    _zipcode: string = "";
    _city: string = "";
  
    constructor(props: AddressProps) {
        this._street = props.street;
        this._number = props.number;
        this._zipcode = props.zipcode;
      this._city = props.city;
    }
  
    get street() {
      return this._street;
    }
  
    get number() {
      return this._number;
    }
  
    get zipcode() {
      return this._zipcode;
    }
  
    get city() {
      return this._city;
    }
  }
  