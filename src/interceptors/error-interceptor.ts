import { FieldMessage } from './../models/fieldmessage';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        public alertController: AlertController
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req)
            .catch((error, caught) => {

                let errorObj = error;
                if (errorObj.error) {
                    errorObj = errorObj.error;
                }
                if (!errorObj.status) {
                    errorObj = JSON.parse(errorObj);
                }

                console.log("Erro detectado pelo interceptor:");
                console.log(errorObj);

                switch (errorObj.status) {
                    case 401:
                        this.handle401();
                        break;

                    case 403:
                        this.handle403();
                        break;

                    case 422:
                        this.handle422(errorObj);
                        break;

                    default:
                        this.handleDefaultError(errorObj);
                }

                return Observable.throw(errorObj);
            }) as any;
    }

    handle401() {
        let alert = this.generateMessageError('Falha de Autenticação','E-mail ou senha Incorretos');
        alert.present();
    }

    handle403() {
        let alert = this.generateMessageError('Falha de Autenticação','E-mail ou senha Incorretos');
        alert.present();
    }  

    handleDefaultError(error) {
        let alert = this.generateMessageError('Erro' + error.status + ': ' + error.error,error.message);
        alert.present();
    }

    handle422(error) {
        let alert = this.generateMessageError('Erro de validação',this.listErros(error.errors));
        alert.present();
    }

    private listErros(list: FieldMessage[]):string {
        let s : string='';
        for(var i=0;i<list.length;i++){
            s+='<p><strong>'+list[i].fieldName+'</strong> '+list[i].message+'</p>';
        }
        return s;
    }

    private generateMessageError(title,message) {
        return this.alertController.create({
            title: title,
            message: message,
            enableBackdropDismiss: false,
            buttons: [
                { text: 'Ok' }
            ]
        });
    }   
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};