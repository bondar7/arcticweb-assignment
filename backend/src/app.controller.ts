import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

type HealthResponse = {
  status: 'ok';
  service: 'lead-tracker-api';
};

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API health check' })
  @ApiOkResponse({
    description: 'API is running',
    schema: {
      example: {
        status: 'ok',
        service: 'lead-tracker-api',
      },
    },
  })
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'lead-tracker-api',
    };
  }
}
