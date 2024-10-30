import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ClientProps = {
  id?: Id;
  name: string;
  email: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  zipCode: string;
  state: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Client extends BaseEntity implements AggregateRoot {
  private readonly _name: string;
  private readonly _email: string;
  private readonly _document: string;
  private readonly _street: string;
  private readonly _number: string;
  private readonly _complement: string;
  private readonly _city: string;
  private readonly _zipCode: string;
  private readonly _state: string;

  constructor(props: ClientProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._email = props.email;
    this._document = props.document;
    this._street = props.street;
    this._number = props.number;
    this._complement = props.complement;
    this._city = props.city;
    this._zipCode = props.zipCode;
    this._state = props.state;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get document(): string {
    return this._document;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get complement(): string {
    return this._complement;
  }

  get city(): string {
    return this._city;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get state(): string {
    return this._state;
  }
}
