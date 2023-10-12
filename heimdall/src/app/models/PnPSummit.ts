import { ILocation } from "./ILocation";

export class PnPSummit implements ILocation {
	public SummitCode!: string;
	public AssociationName!: string;
	public RegionName!: string;
	public SummitName!: string;
	public AltM!: string;
	public AltFt!: string;
	public GridRef1!: string;
	public GridRef2!: string;
	public Longitude!: string;
	public Latitude!: string;
	public Points!: string;
	public BonusPoints!: string;
	public ValidFrom!: string;
	public ValidTo!: string;
	public ActivationCount!: string;
	public ActivationDate!: string;
	public ActivationCall!: string;
	public spare!: string;
	public Region!: string;
	public ShireID!: string;
	public Status!: string;
}
