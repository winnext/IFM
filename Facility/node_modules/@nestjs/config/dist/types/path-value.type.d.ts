export declare type PathImpl<T, Key extends keyof T> = Key extends string ? T[Key] extends Record<string, any> ? `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}` | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}` : never : never;
export declare type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;
export declare type Path<T> = keyof T extends string ? PathImpl2<T> extends string | keyof T ? PathImpl2<T> : keyof T : never;
export declare type PathValue<T, P extends Path<T>> = P extends `${infer Key}.${infer Rest}` ? Key extends keyof T ? Rest extends Path<T[Key]> ? PathValue<T[Key], Rest> : never : never : P extends keyof T ? T[P] : never;
