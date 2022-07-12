import type { Kind } from './category';
import type { Country } from './country';
import type { UploadFile } from './upload-file';

export interface FetchError {
	code?: number;
	status?: string;
	message?: string;
	fields?: Record<string, string>;
}

export type Identifiable = {
	id: string;
};

export type Nameable = {
	name: string;
};

export type Linkable = Kind;

export type Nationalizable = {
	country: Country;
};

export type Categorizable = {
	type1: Kind;
	type2: Kind;
	type3: Kind;
};

export type Recordable = {
	created_at?: string;
	updated_at?: string;
};

export type Base = Identifiable & Recordable;

export type Publishable = Base & {
	published_at?: string;
};

export type Likeable = {
	liked?: boolean;
};

export type Listable = Kind & Categorizable;

export type Exhibitable = Publishable &
	Nameable &
	Categorizable &
	Likeable & {
		description: string;
		gallery: UploadFile[];
	};

export type Searchable = Exhibitable & Nationalizable & Categorizable;

export type DatePickerDate = {
	selectedDates: [dateFrom: Date, dateTo?: Date];
	dateStr:
		| string
		| {
				from: string;
				to: string;
		  };
};

export type DatePickerEvent = CustomEvent<string | DatePickerDate>;

export type SideNavItem = {
	id: string;
	text: string;
};
