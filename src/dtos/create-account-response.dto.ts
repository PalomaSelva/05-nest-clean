import { ApiProperty } from '@nestjs/swagger';
import { CreateAccountRequestDto } from './create-account-request.dto';

export class CreateAccountResponseDto extends CreateAccountRequestDto {
  @ApiProperty({
    description: 'Id do usuário',
    example: 'clx1234567890abcdef',
  })
  id: string;
}
