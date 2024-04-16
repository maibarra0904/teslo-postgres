import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @ApiProperty({
        description: 'How many items to display',
        default: 10
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) //Transforma el query respectivo a número
    limit?: number;

    @ApiProperty({
        description: 'How many items to skip',
        default: 0
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}