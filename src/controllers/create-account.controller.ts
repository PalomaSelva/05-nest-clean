import { Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { CreateAccountResponseDto } from '../dtos/create-account-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountRequestDto } from '../dtos/create-account-request.dto';

@ApiTags('accounts')
@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Criar uma nova conta',
    description: 'Cria uma nova conta de usuário com nome, email e senha. A senha deve conter pelo menos: uma letra minúscula, uma maiúscula, um número e um caractere especial.',
  })
  @ApiResponse({
    status: 201,
    description: 'Conta criada com sucesso',
    type: CreateAccountResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação - Dados da requisição inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['Nome deve ter pelo menos 2 caracteres', 'Email deve ter um formato válido']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Usuário com este email já existe',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Usuário com este email já existe' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  async handle(@Body() body: CreateAccountRequestDto) {
    const { name, email, password } = body;
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException('Usuário com este email já existe');
    }

    const passwordHash = await hash(password, 8);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    return user;
  }
}
