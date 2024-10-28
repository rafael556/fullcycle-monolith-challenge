import ValueObject from "../../../@shared/domain/value-object/value-object.interface";

type AddressProps = {
  street: string;
  number: string;
  zipcode: string;
  city: string;
  complement: string;
  state: string;
};

export default class Address implements ValueObject {
  private readonly _street: string;
  private readonly _number: string;
  private readonly _zipcode: string;
  private readonly _city: string;
  private readonly _complement: string;
  private readonly _state: string;

  constructor(props: AddressProps) {
    this._street = props.street;
    this._number = props.number;
    this._zipcode = props.zipcode;
    this._city = props.city;
    this._complement = props.complement;
    this._state = props.state;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get zipcode(): string {
    return this._zipcode;
  }

  get city(): string {
    return this._city;
  }

  get complement(): string {
    return this._complement;
  }
  
  get state(): string {
    return this._state;
  }
}
