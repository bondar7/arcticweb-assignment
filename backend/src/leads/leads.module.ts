import { Module } from '@nestjs/common';

import { LeadCommentsService } from './lead-comments.service';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, LeadCommentsService],
})
export class LeadsModule {}
