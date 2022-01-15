import type { User, UserInput } from "$lib/store/auth";

export const updateUserService = async (id: string|number,input: UserInput): Promise<User> =>{
    return new Promise(async(resolve, reject)=>{
        const res = await fetch(`/user/update-${id}.json`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            ...input
            }),
        });
        if(res.ok){
            const data: User = await res.json();
            resolve(data);
        }else{
            const error = await res.json();
            reject(error);
        }
    });
};