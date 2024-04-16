import { createParamDecorator } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data, req) => {

        const request = req.switchToHttp().getRequest();
        const raw = request.rawHeaders

        return raw
}
);