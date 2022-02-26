import type { Emergency, EmergencyInput } from "$lib/store/emergency";

export const updateEmergencyService = async (id: string|number,input: EmergencyInput): Promise<Emergency> =>{
    return new Promise(async(resolve, reject)=>{
        const res = await fetch(`/emergency/update-${id}.json`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            ...input
            }),
        });
        if(res.ok){
            const data: Emergency = await res.json();
            resolve(data);
        }else{
            const error = await res.json();
            reject(error);
        }
    });
}

export const createEmergencyService = async (input: EmergencyInput): Promise<Emergency> =>{
    return new Promise(async(resolve, reject)=>{
        const res = await fetch(`/emergency/create.json`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            ...input
            }),
        });
        
        if(res.ok){
            const data: Emergency = await res.json();
            resolve(data);
        }else{
            const error = await res.json();
            reject(error);
        }
    });
}

export const deleteEmergencyService = async (id: string|number): Promise<Boolean> =>{
    return new Promise(async(resolve, reject)=>{
        const res = await fetch(`/emergency/delete-${id}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(res.ok){
            const data: Emergency = await res.json();
            resolve(true);
        }else{
            const error = await res.json();
            reject(error);
        }
    });
}