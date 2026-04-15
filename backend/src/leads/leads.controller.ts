import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ListLeadsQueryDto } from './dto/list-leads-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CommentResponseDto } from './responses/comment-response.dto';
import {
  LeadListResponseDto,
  LeadResponseDto,
} from './responses/lead-response.dto';
import { LeadCommentsService } from './lead-comments.service';
import { LeadsService } from './leads.service';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly leadCommentsService: LeadCommentsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List leads' })
  @ApiOkResponse({ type: LeadListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  listLeads(@Query() query: ListLeadsQueryDto): Promise<LeadListResponseDto> {
    return this.leadsService.listLeads(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create lead' })
  @ApiCreatedResponse({ type: LeadResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid lead payload' })
  createLead(@Body() dto: CreateLeadDto): Promise<LeadResponseDto> {
    return this.leadsService.createLead(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by id' })
  @ApiParam({ name: 'id', description: 'Lead UUID' })
  @ApiOkResponse({ type: LeadResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid lead id' })
  @ApiNotFoundResponse({ description: 'Lead not found' })
  getLead(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<LeadResponseDto> {
    return this.leadsService.getLead(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead' })
  @ApiParam({ name: 'id', description: 'Lead UUID' })
  @ApiOkResponse({ type: LeadResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid lead id or payload' })
  @ApiNotFoundResponse({ description: 'Lead not found' })
  updateLead(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateLeadDto,
  ): Promise<LeadResponseDto> {
    return this.leadsService.updateLead(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete lead' })
  @ApiParam({ name: 'id', description: 'Lead UUID' })
  @ApiNoContentResponse({ description: 'Lead deleted' })
  @ApiBadRequestResponse({ description: 'Invalid lead id' })
  @ApiNotFoundResponse({ description: 'Lead not found' })
  async deleteLead(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.leadsService.deleteLead(id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'List comments for a lead' })
  @ApiParam({ name: 'id', description: 'Lead UUID' })
  @ApiOkResponse({ type: CommentResponseDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Invalid lead id' })
  @ApiNotFoundResponse({ description: 'Lead not found' })
  listComments(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CommentResponseDto[]> {
    return this.leadCommentsService.listComments(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to a lead' })
  @ApiParam({ name: 'id', description: 'Lead UUID' })
  @ApiCreatedResponse({ type: CommentResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid lead id or comment payload' })
  @ApiNotFoundResponse({ description: 'Lead not found' })
  createComment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.leadCommentsService.createComment(id, dto);
  }
}
