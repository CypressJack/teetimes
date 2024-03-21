import { TeeTime, GreenFee } from '@prisma/client';

interface TeeTime extends TeeTime {
  green_fees: GreenFee[]
}