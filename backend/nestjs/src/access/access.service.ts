import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/core/entities/user.entity";
import { JWTPayload } from "src/core/interfaces/jwt.initerface";
import { UserService } from "src/core/services/user.service";
import { SigninDto } from "./dto/signin.dto";
import { SignupDto } from "./dto/signup.dto";


@Injectable()
export class AccessService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {

  }

  async validateUserPassword(dto: SigninDto): Promise<UserEntity> {
    const user = await this.usersService.getByEmail(dto.email);
    if (user) {
      const valid = await user.validatePassword(dto.password);

      if (valid) {
        return user;
      } 
    }

    throw new ForbiddenException('Invalid email or password');
  }

  async createUser(dto: SignupDto) {
    return await this.usersService.create(dto.email, dto.username, dto.password);
  }
  
  generateAccessToken(id: string) {
    return this.jwtService.sign({
      AdminAccessToken: 0
    } as JWTPayload, {
      subject: id
    }); 
  }

}
