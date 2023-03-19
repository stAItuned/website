import type { SvelteComponentTyped } from "svelte"
import type { Writable } from "svelte/store"

export interface Option {
    value: string,
    label: string
}

export type InputType = "text" | "textarea" | "email" | "password"

export interface BaseField {
    id?: string,
    name: string,
    label?: string,
    errors?: Writable<Record<string, string>>,
    form?: Writable<Record<string, any>>,
}

export interface BaseSelect extends BaseField {
    options: Option[]
}

export interface InputProps extends BaseField {
    placeholder?: string,
    type?: InputType,
    rows?: number
}

export interface SelectProps extends BaseSelect {
    defaultOption?: Option,
}

export interface MultiSelectProps extends BaseSelect {
    selected?: string[],
}

export interface DropzoneProps extends BaseField {
    accept: string,
    desc?: string
}

export interface ToggleProps extends BaseField { }

export type FieldProps =
    InputProps
    | SelectProps
    | MultiSelectProps
    | DropzoneProps
    | ToggleProps

export interface Field {
    component: new (...args: any) => SvelteComponentTyped<FieldProps>,
    attributes: FieldProps
}