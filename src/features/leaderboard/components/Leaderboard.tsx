import Box from '@mui/material/Box';
import styled from 'styled-components';
import { DataGrid, GridColDef, GridValueGetterParams, GridSortModel, frFR, GridLocaleText } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Team, Trainer } from '@/types/model';
import { getLightTeamColor } from '@/utils/team-colors';
import { SupportedLocale } from '@/utils/i18n';

interface LeaderboardProps {
  trainers: Trainer[];
}

const columns: GridColDef[] = [
  {
    field: 'trainer_id',
    headerName: 'Rank',
    width: 90,
    sortable: false,
    type: 'number',
    valueGetter: (params: GridValueGetterParams) => {
      return params.api.getRowIndex(params.id) + 1;
    },
  },
  {
    field: 'name',
    flex: 1,
    headerName: 'Trainer',
    minWidth: 150,
  },
  {
    field: 'level',
    flex: 1,
    headerName: 'Level',
    minWidth: 120,
    type: 'number',
  },
  {
    field: 'xp',
    flex: 1,
    headerName: 'XP',
    minWidth: 120,
    type: 'number',
  },
  {
    field: 'battles_won',
    flex: 1,
    headerName: 'Battles won',
    minWidth: 160,
    type: 'number',
  },
  {
    field: 'caught_pokemon',
    flex: 1,
    headerName: 'Caught Pokémon',
    minWidth: 200,
    type: 'number',
  },
];

const ColoredTeamRowsContainer = styled(Box)`
  [class^='team']:hover {
    cursor: pointer;
  }

  .team-${Team.MYSTIC} {
    background-color: ${getLightTeamColor(Team.MYSTIC)};
  }
  .team-${Team.VALOR} {
    background-color: ${getLightTeamColor(Team.VALOR)};
  }
  .team-${Team.INSTINCT} {
    background-color: ${getLightTeamColor(Team.INSTINCT)};
  }
`;

export const Leaderboard = ({ trainers }: LeaderboardProps): JSX.Element => {
  const router = useRouter();

  const { locale } = router;
  let localeText: Partial<GridLocaleText> = {};
  if (locale === SupportedLocale.FR && 'components' in frFR) {
    localeText = frFR.components.MuiDataGrid.defaultProps.localeText;
  }

  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'xp', sort: 'desc' }]);

  useEffect(() => {
    router.prefetch(`/profile/${encodeURIComponent('' + trainers[0].trainer_id)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ColoredTeamRowsContainer>
      <DataGrid
        autoHeight
        columns={columns}
        getRowClassName={(params) => `team-${params.row.team}`}
        getRowId={(row) => row.trainer_id}
        hideFooter
        localeText={localeText}
        onRowClick={(params) => router.push(`/profile/${encodeURIComponent(params.row.trainer_id)}`)}
        onSortModelChange={(model) => setSortModel(model)}
        rows={trainers}
        sortingOrder={['desc', 'asc']}
        sortModel={sortModel}
      />
    </ColoredTeamRowsContainer>
  );
};
