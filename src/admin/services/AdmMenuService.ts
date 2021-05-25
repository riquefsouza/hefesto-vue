import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '@/environments/environment';
import { TokenService } from '@/base/services/TokenService';
import { AdmMenu } from "@/admin/models/AdmMenu";
import AdmPageService from './AdmPageService';

export default class AdmMenuService {

    private admPageService: AdmPageService;
    private PATH: string;
    private axiosConfig: AxiosRequestConfig;
    private tokenService: TokenService;

    constructor() {
        this.PATH = environment.apiVersion + '/admMenu';
        this.tokenService = new TokenService();
        this.axiosConfig = this.tokenService.getAuth();
        this.admPageService = new AdmPageService();
    }

    public findIndexById(listaAdmMenu: AdmMenu[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmMenu.length; i++) {
            if (listaAdmMenu[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    /*
    public async findAll(): Promise<AdmMenu[]> {
        const res = await axios.get('data/admMenu.json');
        return res.data;
    }

    public findById(id: number): Promise<AdmMenu> {
        const res = new Promise<AdmMenu>((resolve, reject) => {
            let lista: AdmMenu[] = [];

            this.findAll()
                .then(Menus => {
                    lista = Menus.filter(Menu => Menu.id === id);

                    lista.forEach(menu => {
                        menu.admPage = undefined;
                        menu.admMenuParent = undefined;
                    });

                    resolve(lista[0]);
                })
                .catch(erro => {
                    reject(erro);
                });
            }
        );

        return res;
    }

    public findAllWithPages(): Promise<AdmMenu[]> {
        const res = new Promise<AdmMenu[]>((resolve, reject) => {

            this.findAll().then(menus => {
                menus.forEach(menu => {
                    this.admPageService.findById(menu.idPage).then(page => menu.admPage = page);
                    this.findById(menu.idMenuParent).then(menuParent => menu.admMenuParent = menuParent);
                });
                resolve(menus);
            })
            .catch(erro => {
                reject(erro);
            });

        });

        return res;
    }
    */

    public findAllPaginated(page: number): Promise<AdmMenu[]> {
        const res = new Promise<AdmMenu[]>((resolve, reject) => {
            const url = `${this.PATH}/paged?page=${page}`;
            const config = this.axiosConfig;
            axios.get<AdmMenu[]>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

    public findAll(): Promise<AdmMenu[]> {
        const res = new Promise<AdmMenu[]>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.get<AdmMenu[]>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

    public findById(id: number): Promise<AdmMenu> {
        const res = new Promise<AdmMenu>((resolve, reject) => {
            const url = `${this.PATH}/${id}`;
            const config = this.axiosConfig;
            axios.get<AdmMenu>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

    public insert(obj: AdmMenu): Promise<AdmMenu> {
        const res = new Promise<AdmMenu>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.post<AdmMenu>(url, obj, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

    public update(obj: AdmMenu): Promise<AdmMenu> {
        const res = new Promise<AdmMenu>((resolve, reject) => {
            const url = `${this.PATH}/${obj.id}`;
            const config = this.axiosConfig;
            axios.put<AdmMenu>(url, obj, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

    public delete(id?: number | null): Promise<string> {
        const res = new Promise<string>((resolve, reject) => {
            const url = `${this.PATH}/${id}`;
            const config = this.axiosConfig;
            axios.delete<string>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

}