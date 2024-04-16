import { createParamDecorator, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator(
    (data, req) => {
        //console.log(data);
        //console.log(req.switchToHttp().getRequest());
        const request = req.switchToHttp().getRequest();
        const user = request.user
        

        if (!user) 
            throw new InternalServerErrorException('User not found')

        return (!data) ? user : user[data]
    }
);

export const GetUser2 = createParamDecorator(
    (data, req) => {
        //console.log(data);
        //console.log(req.switchToHttp().getRequest());
        const request = req.switchToHttp().getRequest();
        const user = request.user
        

        if (!user) 
            //throw new InternalServerErrorException('User not found')

        return (!data) ? user : user[data]
    }
);